<?php

declare(strict_types=1);

namespace App\Domain\Gate;

use App\Domain\Gate\Event\GateOpenRequested;
use App\Domain\User\UserId;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use SimpleBus\Message\Recorder\ContainsRecordedMessages;
use SimpleBus\Message\Recorder\PrivateMessageRecorderCapabilities;

/**
 * @ORM\Entity
 */
class OpenRequest implements ContainsRecordedMessages
{
    use PrivateMessageRecorderCapabilities;

    /**
     * @ORM\Id()
     * @ORM\Column(type="gate_request_id")
     */
    private OpenRequestId $id;

    /**
     * @ORM\Column(type="user_id")
     */
    private UserId $userId;

    /**
     * @ORM\Column(type="datetimetz_immutable")
     */
    private DateTimeImmutable $createdAt;

    public function __construct(UserId $userId)
    {
        $this->id = OpenRequestId::generate();
        $this->userId = $userId;
        $this->createdAt = new DateTimeImmutable();

        $this->record(new GateOpenRequested($this->id));
    }
}
