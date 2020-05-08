<?php

declare(strict_types=1);

namespace App\Domain\Gate;

use App\Domain\Gate\Event\GateOpened;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use SimpleBus\Message\Recorder\ContainsRecordedMessages;
use SimpleBus\Message\Recorder\PrivateMessageRecorderCapabilities;

/**
 * @ORM\Entity
 */
class OpenSuccess implements ContainsRecordedMessages
{
    use PrivateMessageRecorderCapabilities;

    /**
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @ORM\Column(type="gate_request_id")
     */
    private OpenRequestId $requestId;

    /**
     * @ORM\Column(type="datetimetz_immutable")
     */
    private DateTimeImmutable $createdAt;

    public function __construct(OpenRequestId $requestId)
    {
        $this->id = Uuid::uuid6();
        $this->requestId = $requestId;
        $this->createdAt = new DateTimeImmutable();

        $this->record(new GateOpened($this->requestId));
    }
}
